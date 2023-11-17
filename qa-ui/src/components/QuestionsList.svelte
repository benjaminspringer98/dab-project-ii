<script>
    export let courseId;

    const getQuestions = async () => {
        const response = await fetch(`/api/courses/${courseId}/questions`);
        return await response.json();
    };

    let questionsPromise = getQuestions();
</script>

{#await questionsPromise}
    <p>Loading...</p>
{:then questions}
    {#each questions as question}
        <div class="border-2 border-gray-200 rounded-md p-4 m-4">
            <p>{question.text}</p>
            <p>{question.user_uuid}</p>
            {#await upvotesPromise}
                <p>Loading...</p>
            {:then upvotes}
                <p>{upvotes}</p>
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </div>
    {/each}
{:catch error}
    <p>{error.message}</p>
{/await}
