<script>

    import { scale } from 'svelte/transition';

</script>

<style>
    .pizza-spinner {
        animation: rotation 2s infinite linear;
    }
    
    @keyframes rotation {
        from {
            transform: rotate(0deg);
        } to {
            transform: rotate(359deg);
        }
    }
</style>

<div class="pizza-spinner-wrap">
    <img src="/icons/svgs/pizzaSpinner.svg" height="60" width="60" class="pizza-spinner">
</div>