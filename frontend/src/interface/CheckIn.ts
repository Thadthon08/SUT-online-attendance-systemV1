export interface CheckInRequest {
  ATR_id: string;
  sid: string;
  att_lat: number;
  att_long: number;
}

export interface Attendance {
  att_id: string;
  ATR_id: string;
  sid: string;
  att_lat: number;
  att_long: number;
  att_time: string;
  updatedAt: string;
  createdAt: string;
}
