export class ConnectMoodleRequest {
  username: string;
  password: string;
  serviceName: string;
  host: string;
}

export class ConnectMoodleResponse {
  error: number;
  data: string;
  message: string;
}

export class IsMoodleConnectedResponse {
  error: number;
  data: boolean;
  message: string;
}
