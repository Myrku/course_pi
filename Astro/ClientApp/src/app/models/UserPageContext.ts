export class CameraInfo {
    id: number;
    camera: string = '';
    cameraLens: string = '';
}

export class ChartInfo {
    name: string;
    value: number
}

export class UserPageContext {
    publishedPosts: number;
    allLikes: number;
    allReports: number;
    cameraInfo: CameraInfo = new CameraInfo();
    chartInfo: ChartInfo[];
}