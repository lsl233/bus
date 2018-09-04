class Location {
    constructor() {
        if (navigator.geolocation) {
            this.geolocation = navigator.geolocation;
            console.log(this.geolocation.getCurrentPosition)
        } else {
            console.log('该浏览器不支持定位功能！');
        }

    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                console.log(position)
                resolve({ latitude, longitude })
            }, (error) => {
                reject(error);
            }, { maximumAge: 0, timeout: 10000, enableHighAccuracy: true })
        })
    }
}

export default new Location();