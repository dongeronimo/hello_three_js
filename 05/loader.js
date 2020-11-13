
class MyLoader{
    constructor(THREE, FBXLoader, loadedCallback, progressCallback, errorCallback){
        this.THREE = THREE;
        this.FBXLoader = FBXLoader
        this.progressCallback = progressCallback
        this.errorCallback = errorCallback;
        this.loadedCallback = loadedCallback;
        this.onSuccess = (loadedObject)=>{
            this.loadedCallback(loadedObject)
        }
        this.onProgress = (progress)=>{
            const totalToLoad = progress.total;
            const loaded = progress.loaded;
            const loadPercentage = loaded / totalToLoad;
            if(this.progressCallback){
                this.progressCallback(loadPercentage);
            }
        }
        this.onError = (error)=>{
            if(this.errorCallback){
                this.errorCallback(error);
            }
        }
    }
    load(url){
        const loader = new this.FBXLoader();
        loader.load(url, this.onSuccess, this.onProgress, this.onError);
    }
    
    
    
}