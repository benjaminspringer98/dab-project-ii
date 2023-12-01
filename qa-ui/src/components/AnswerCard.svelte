<script>
    export let answer;
    export let courseId;
    export let questionId;

    import { userUuid } from "../stores/stores.js";

    const formatUserUuid = (uuid) => {
        return uuid.split("-")[0];
    };

    const fetchUpvoteData = async () => {
        const data = {
            userUuid: $userUuid,
        };

        const response = await fetch(
            `/api/courses/${courseId}/questions/${questionId}/answers/${answer.id}/upvotes`,
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
            `/api/courses/${courseId}/questions/${questionId}/answers/${answer.id}/toggleUpvote`,
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
    <p>{answer.text}</p>
    <p>{formatUserUuid(answer.user_uuid)}</p>

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
                on:click={toggleUpvote(answer.id)}
                ><i class="fa-regular fa-thumbs-up fa-xl" /><span
                    >{upvoteData.count}</span
                ></button
            >
        {/if}
    {:catch error}
        <p>{error.message}</p>
    {/await}
</div>
