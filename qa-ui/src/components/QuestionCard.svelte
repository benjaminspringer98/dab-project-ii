<script>
    export let question;
    export let courseId;

    import { userUuid } from "../stores/stores.js";

    const fetchUpvoteData = async () => {
        const data = {
            userUuid: $userUuid,
        };

        const response = await fetch(
            `/api/courses/${courseId}/questions/${question.id}/upvotes`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
        return await response.json();
    };

    const toggleUpvote = async () => {
        const data = {
            userUuid: $userUuid,
        };

        const response = await fetch(
            `/api/courses/${courseId}/questions/${question.id}/toggleUpvote`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );

        upvoteDataPromise = fetchUpvoteData();
    };

    let upvoteDataPromise = fetchUpvoteData();
</script>

<div class="border-2 border-gray-200 rounded-md p-4 m-4">
    <p>{question.text}</p>
    <p>{question.user_uuid}</p>
    <a href={`/courses/${courseId}/questions/${question.id}`}>Go</a>

    {#await upvoteDataPromise}
        <p>Loading...</p>
    {:then upvoteData}
        {#if upvoteData.hasUserUpvoted}
            <!-- TODO: make the following cleaner and remove redundancy-->
            <button
                class="bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded-full"
                on:click={toggleUpvote}
                ><i class="fa-solid fa-thumbs-up fa-xl" />
                <span>{upvoteData.count}</span></button
            >
        {:else}
            <button
                class="bg-blue-200 hover:bg-blue-400 py-2 px-4 rounded-full"
                on:click={toggleUpvote(question.id)}
                ><i class="fa-regular fa-thumbs-up fa-xl" /><span
                    >{upvoteData.count}</span
                ></button
            >
        {/if}
    {:catch error}
        <p>{error.message}</p>
    {/await}
</div>
