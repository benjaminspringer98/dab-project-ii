<script>
    export let courses;
</script>

<ul
    class="m-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg"
>
    {#each courses as course}
        <a
            class="block w-full text-xl font-normal px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:text-violet-700"
            href={`/courses/${course.id}`}><li>{course.name}</li></a
        >
    {/each}
</ul>
