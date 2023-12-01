<script>
    export let question;
    export let courseId;

    import { userUuid } from "../stores/stores.js";
    import { formatUserUuid, formatDate } from "../utils/formatters.js";

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
    <a
        class="text-2xl hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-700"
        href={`/courses/${courseId}/questions/${question.id}`}
        >{question.title}</a
    >
    <hr class="my-2" />
    <p class="text-gray-500">
        Asked by {formatUserUuid(question.user_uuid)} on {formatDate(
            question.created_at,
        )}
    </p>

    {#await upvoteDataPromise}
        <div
            class="flex justify-center items-center bg-yellow-200 hover:bg-yellow-300 w-14 h-14 rounded-full"
        >
            <div
                class="w-6 h-6 rounded-full border-t-2 border-black animate-spin"
            ></div>
        </div>
    {:then upvoteData}
        {#if upvoteData.hasUserUpvoted}
            <button
                class="bg-yellow-200 hover:bg-yellow-300 w-14 h-14 rounded-full"
                on:click={toggleUpvote}
                ><i class="fa-solid fa-thumbs-up fa-xl" />
                <span>{upvoteData.count}</span></button
            >
        {:else}
            <button
                class="bg-yellow-200 hover:bg-yellow-300 w-14 h-14 rounded-full"
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

<style>
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
