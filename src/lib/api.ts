const DEFAULT_API_BASE_URL = 'http://43.200.145.225';
const VERCEL_API_PROXY_URL = '/api/backend';

export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && configuredUrl.startsWith('http:')) {
    return VERCEL_API_PROXY_URL;
  }

  return configuredUrl;
}

export type HealthCheckResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthRegisterRequest = AuthLoginRequest & {
  nickname: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  userId?: string | number;
};

export type VideoStatus = 'queued' | 'processing' | 'completed' | 'failed' | string;

export type SuspiciousFrame = {
  frameIndex: number;
  probability?: number;
};

export type AnalysisResult = {
  final_verdict: string;
  deepfake_score?: number;
  t2v_score?: number;
  suspicious_frames: SuspiciousFrame[];
  xai_heatmap_url?: string;
  per_frame_probs?: number[];
  raw: unknown;
};

export type HistoryRecord = {
  id: string;
  title: string;
  date: string;
  result: 'FAKE' | 'REAL';
  percentage: string;
  thumb?: string;
  duration?: string;
  size?: string;
  raw: unknown;
};

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function checkHealth(path: string, errorMessage: string): Promise<HealthCheckResult> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  const text = await response.text();
  const data = text ? parseResponseBody(text) : null;

  return {
    ok: true,
    status: response.status,
    data,
  };
}

export function checkAuthHealth() {
  return checkHealth('/auth/health', 'auth health check failed');
}

export function checkUserHealth() {
  return checkHealth('/user/health', 'user health check failed');
}

export async function register(payload: AuthRegisterRequest) {
  const data = await request<Record<string, unknown>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    userId: readId(readFirst(data, ['user_id', 'userId', 'id'])),
    message: readFirst(data, ['message']) ?? '회원가입이 완료되었습니다.',
    raw: data,
  };
}

export async function login(payload: AuthLoginRequest): Promise<AuthSession> {
  const data = await request<Record<string, unknown>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const accessToken = readFirst(data, ['accessToken', 'access_token', 'token', 'jwt']);
  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('로그인 응답에서 토큰을 찾을 수 없습니다.');
  }

  const refreshToken = readFirst(data, ['refreshToken', 'refresh_token']);
  return {
    accessToken,
    refreshToken: typeof refreshToken === 'string' ? refreshToken : undefined,
    userId: readId(readFirst(data, ['user_id', 'userId', 'id'])),
  };
}

export async function logout(token: string) {
  return request<{ message?: string }>('/api/auth/logout', {
    method: 'POST',
    token,
  });
}

export async function refreshAuthToken(refreshToken: string) {
  const data = await request<Record<string, unknown>>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken, refresh_token: refreshToken }),
  });

  const accessToken = readFirst(data, ['accessToken', 'access_token', 'token', 'jwt']);
  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('토큰 갱신 응답에서 새 토큰을 찾을 수 없습니다.');
  }

  return accessToken;
}

export async function uploadVideo(file: File, token?: string | null) {
  const formData = new FormData();
  formData.append('video', file);

  const data = await request<Record<string, unknown>>('/api/videos/upload', {
    method: 'POST',
    body: formData,
    token,
  });

  return readVideoId(data);
}

export async function requestVideoUrl(url: string, token?: string | null) {
  const data = await request<Record<string, unknown>>('/api/videos/url', {
    method: 'POST',
    body: JSON.stringify({ url }),
    token,
  });

  return readVideoId(data);
}

export async function getVideoStatus(videoId: string, token?: string | null) {
  const data = await request<Record<string, unknown>>(`/api/videos/${videoId}/status`, { token });
  const status = readFirst(data, ['status']);
  return typeof status === 'string' ? status : 'processing';
}

export async function getVideoResult(videoId: string, token?: string | null) {
  const data = await request<unknown>(`/api/videos/${videoId}/result`, { token });
  return normalizeAnalysisResult(data);
}

export async function getHistory(token: string) {
  const data = await request<unknown>('/api/history', { token });
  const list = Array.isArray(data) ? data : readFirst(data, ['records', 'history', 'items', 'data']);
  return Array.isArray(list) ? list.map(normalizeHistoryRecord) : [];
}

export async function getHistoryDetail(id: string, token: string) {
  const data = await request<unknown>(`/api/history/${id}`, { token });
  return normalizeHistoryRecord(data);
}

export async function deleteHistoryRecord(id: string, token: string) {
  return request<{ message?: string }>(`/api/history/${id}`, {
    method: 'DELETE',
    token,
  });
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const isFormData = body instanceof FormData;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    body,
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await response.text();
  const data = text ? parseResponseBody(text) : null;

  if (!response.ok) {
    const message = readErrorMessage(data) ?? `API 요청에 실패했습니다. (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

function normalizeAnalysisResult(raw: unknown): AnalysisResult {
  const root = asRecord(raw);
  const deepfake = asRecord(readFirst(root, ['deepfake', 'deepfake_result', 'deepfakeResult'])) ?? root;
  const t2v = asRecord(readFirst(root, ['t2v', 't2v_result', 't2vResult'])) ?? root;
  const evidence = asRecord(deepfake?.evidence);
  const heatmaps = asRecord(evidence?.heatmaps);
  const t2vVisualization = asRecord(t2v?.xai_visualization);
  const t2vHeatmaps = t2vVisualization?.heatmaps;
  const t2vFirstHeatmap = Array.isArray(t2vHeatmaps) ? asRecord(t2vHeatmaps[0]) : undefined;

  const deepfakeProb = readNumber(deepfake?.ensemble_prob);
  const t2vProb = readNumber(t2v?.t2v_prob);
  const finalVerdict = readVerdict(root, deepfake, t2v, deepfakeProb, t2vProb);
  const suspectIndexes = toNumberArray(evidence?.suspect_frame_idx);
  const suspectProbs = toNumberArray(evidence?.suspect_frame_prob);

  return {
    final_verdict: finalVerdict,
    deepfake_score: toPercent(deepfakeProb),
    t2v_score: toPercent(t2vProb),
    suspicious_frames: suspectIndexes.map((frameIndex, index) => ({
      frameIndex,
      probability: suspectProbs[index],
    })),
    xai_heatmap_url: readString(heatmaps?.v7) ?? readString(t2vFirstHeatmap?.overlay_url),
    per_frame_probs: toNumberArray(deepfake?.per_frame_probs),
    raw,
  };
}

function normalizeHistoryRecord(raw: unknown): HistoryRecord {
  const record = asRecord(raw) ?? {};
  const result = String(readFirst(record, ['result', 'verdict', 'final_verdict']) ?? '').toUpperCase();
  const score = readNumber(readFirst(record, ['percentage', 'score', 'deepfake_score', 'probability']));
  const id = String(readFirst(record, ['id', 'history_id', 'video_id']) ?? '');

  return {
    id,
    title: String(readFirst(record, ['title', 'filename', 'file_name', 'url']) ?? `analysis-${id || 'record'}`),
    date: String(readFirst(record, ['date', 'created_at', 'createdAt']) ?? ''),
    result: result.includes('FAKE') || result.includes('DEEPFAKE') || result.includes('T2V') ? 'FAKE' : 'REAL',
    percentage: typeof score === 'number' ? `${score > 1 ? score.toFixed(1) : (score * 100).toFixed(1)}%` : '',
    thumb: readString(readFirst(record, ['thumb', 'thumbnail', 'thumbnail_url'])),
    duration: readString(record.duration),
    size: readString(record.size),
    raw,
  };
}

function readVideoId(data: Record<string, unknown>) {
  const videoId = readFirst(data, ['video_id', 'videoId', 'id']);
  if (typeof videoId !== 'string' && typeof videoId !== 'number') {
    throw new Error('영상 요청 응답에서 video_id를 찾을 수 없습니다.');
  }

  return String(videoId);
}

function readId(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') return value;
  return undefined;
}

function readVerdict(
  root: Record<string, unknown> | undefined,
  deepfake: Record<string, unknown> | undefined,
  t2v: Record<string, unknown> | undefined,
  deepfakeProb?: number,
  t2vProb?: number,
) {
  const explicit = readString(readFirst(root, ['final_verdict', 'verdict', 'decision']));
  if (explicit) return explicit;

  const deepfakeDecision = readString(deepfake?.decision);
  const t2vDecision = readString(t2v?.decision);
  if (isAiDecision(deepfakeDecision) || isAiDecision(t2vDecision)) return 'deepfake';
  if ((deepfakeProb ?? 0) >= 0.5 || (t2vProb ?? 0) >= 0.5) return (t2vProb ?? 0) > (deepfakeProb ?? 0) ? 't2v' : 'deepfake';
  return 'real';
}

function isAiDecision(value?: string) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return normalized.includes('fake') || normalized.includes('ai') || normalized.includes('t2v');
}

function toPercent(value?: number) {
  if (typeof value !== 'number') return undefined;
  return value > 1 ? value : value * 100;
}

function toNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map(readNumber).filter((item): item is number => typeof item === 'number');
}

function readNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readString(value: unknown) {
  return typeof value === 'string' && value ? value : undefined;
}

function readFirst(data: unknown, keys: string[]) {
  const record = asRecord(data);
  if (!record) return undefined;
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }

  return undefined;
}

function readErrorMessage(data: unknown) {
  return readString(readFirst(data, ['message', 'error', 'detail']));
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

function parseResponseBody(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
