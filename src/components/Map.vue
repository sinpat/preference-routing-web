<template>
    <div class="map">
        <div id="mapid"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import L from 'leaflet';

@Component
export default class Map extends Vue {
    private map: any = null;
    private source: any = null;
    private target: any = null;

    private mounted() {
        this.map = L.map('mapid').setView([48.66, 8.598], 14);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
        this.initListeners();
    }

    private initListeners() {
        this.map.on('click', this.handleLeftClick);
        this.map.on('contextmenu', this.handleRightClick);
    }

    private handleLeftClick(event: any) {
        const latlng = event.latlng;
        this.source = latlng;
        L.marker(latlng, {
            title: 'Source',
            draggable: true,
            autoPan: true,
        }).addTo(this.map);
    }

    private handleRightClick(event: any) {
        const latlng = event.latlng;
        this.target = latlng;
        L.marker(latlng, {
            title: 'Target',
            draggable: true,
            autoPan: true,
        }).addTo(this.map);
    }
}
</script>

<style lang="scss">
#mapid {
    height: 500px;
}
</style>

