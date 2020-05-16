export type PlayList = {
    id: number;
    title: string;
    description?: string;
    wallpaperIds: string[];
    thumb: string | null;
    config: {
        delay: number; // number of miliconds to change the wallpapers
    };
};
export type PlayListState = {
    timer: any | null;
    currentPlaylistId: null | string;
};

const state: PlayListState = {
    timer: null,
    currentPlaylistId: null
};

export default state;
