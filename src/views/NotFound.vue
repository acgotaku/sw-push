<template>
  <div :class="$style.notfound">
    <h1 :class="$style.title">404</h1>
    <div :class="$style.text">Error 404 - Not found</div>
    <router-link
      :to="{
        name: 'home'
      }"
      :class="$style.button"
    >
      Back Home
    </router-link>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {}
</script>
<style lang="postcss" module>
.notfound {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  color: var(--color-secondary);

  .title {
    font-size: 72px;
    font-weight: 400;
  }

  .text {
    font-size: 16px;
  }

  .button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 40px;
    margin-top: 24px;
    font-size: 16px;
    color: var(--color-secondary);
    background: var(--color-white);
    border-radius: 4px;
    border: 1px solid var(--color-border);

    &:hover {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-hover);
      }
    }
  }
}
</style>
