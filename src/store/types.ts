
export type RootState = {
    [prop: string]: any;
    loading: boolean;
    notifications: any[];
    app: {
        appPath: string;
        dataPath: string;
        thumbsPath: string;
        window: any;
    };
}

// export modules typess
export * from "@/store/modules/playlist/state";
export * from "@/store/modules/wallpaper/state";
