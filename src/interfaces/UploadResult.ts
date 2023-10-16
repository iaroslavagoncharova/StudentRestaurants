// interface for uploading avatar

interface UploadResult {
  message: string;
  data: {
    avatar: string;
    _id: string;
  };
}

interface uploadFav {
  message: string;
  data: {
    favouriteRestaurant: string;
    _id: string;
  };
}

export type {UploadResult, uploadFav};
