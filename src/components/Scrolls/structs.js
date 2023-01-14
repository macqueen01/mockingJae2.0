class ImageList {
    constructor() {
        this._images = [];
        //this._scrolls_height = [];
        //this._standard_height = 0;
    }

    addImage(image) {
        this._images.push(image);
    }

    getFrameIndex(index) {
        return this._images[index];
    }

    /*
    getFrameIndex(position, startY) {
        let index = Math.floor((position - startY) / standardHeight);
        if (index < 0) return 0;
        if (!_images.getFrameIndex(index)) return _images.getLength() - 1;

        return index;
    }
    */

    getLength() {
        return this._images.length;
    }

    getLastIndex() {
        if (this.getLength() == 0) {
            return false;
        }
        return this.getLength() - 1;
    }

    getImages() {
        return this._images;
    }

    setImage(index, image) {
        this._images[index] = image;
        return this._images[index];
    }

    setImages(lst) {
        this._images = lst;
    }

    setThumbnail(blob) {
        this._thumbnail = blob;
    }

    getThumbnail() {
        if (this._thumbnail) {
            return this._thumbnail;
        }
    }
}

export { ImageList };
