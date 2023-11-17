<script>
    export let courses;
</script>

<ul>
    {#each courses as course}
        <a href={`/courses/${course.id}`}><li>{course.name}</li></a>
    {/each}
</ul>
