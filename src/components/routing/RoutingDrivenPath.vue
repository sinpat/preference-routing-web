<template>
  <l-polyline :lat-lngs="path.coordinates" :color="getColor()">
    <l-tooltip>
      <p>
        <strong>Total Cost: {{ path.total_cost | round }}</strong>
      </p>
      <p v-for="(tag, index) in costTags" :key="index">
        {{ tag }}:
        {{ path.costs[index] | round }}
        ({{ path.alpha[index] }})
      </p>
    </l-tooltip>
    <l-popup>
      <v-btn icon large light>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </l-popup>
  </l-polyline>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { LPolyline, LTooltip, LPopup } from 'vue2-leaflet';

import { IPath } from '@/types/types';
import RoutingState from '@/store/modules/routing';

@Component({
  name: 'PathComponent',
  components: {
    LPolyline,
    LTooltip,
    LPopup,
  },
  filters: {
    round: (value: number) => value.toFixed(2),
  },
})
export default class RoutingMapPath extends Vue {
  @Prop({ required: true }) private path!: IPath;

  get costTags(): string[] {
    return RoutingState.costTags;
  }

  private getColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    r = Math.max(r, 16);
    g = Math.max(g, 16);
    b = Math.max(b, 16);
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
  }
}
</script>