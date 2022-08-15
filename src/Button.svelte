<script>
	let count = 0;
	let current = '';

	function handleClick() {
	  count += 1;
	  if (current == 'foo') {
	      current = '';
	  } else {
	      current = 'foo'
	  }
	}
</script>

<style>
    :global(button) {
        background: black;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 2px;
    }
    
	.active {
	  background: #ff3e00;
	  color: white;
	  border: none;
	  padding: 8px 12px;
	  border-radius: 2px;
	}
</style>

<button 
    class="{current === 'foo' ? 'active' : ''}"
    on:click={handleClick}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>