<script>
    export let course;
    import { userUuid } from "../stores/stores.js";
    import { onMount } from "svelte";
    import QuestionCard from "./QuestionCard.svelte";

    let page = 1;
    let data = [];
    let newBatch = [];
    let hasMoreData = true;
    const offset = 200; // Pixels from the bottom of the page to trigger data fetch

    let questionText = "";
    let errorMessage = "";

    let ws;

    async function fetchData() {
        if (!hasMoreData) return; // Prevent fetching if no more data is available

        const response = await fetch(
            `/api/courses/${course.id}/questions?page=${page}`,
        );

        newBatch = await response.json();

        if (newBatch.length === 0) {
            hasMoreData = false;
            return;
        }
        data = [...data, ...newBatch];
    }

    onMount(() => {
        fetchData();

        window.addEventListener("scroll", function () {
            if (
                window.innerHeight + window.scrollY >=
                    document.body.scrollHeight - offset &&
                hasMoreData
            ) {
                page++;
                fetchData();
            }
        });

        const host = window.location.hostname;
        ws = new WebSocket(
            "ws://" + host + `:7800/api/ws/courses/${course.id}`,
        );

        ws.onmessage = (event) => {
            console.log(event.data);
            const question = JSON.parse(event.data);
            data = [question, ...data];
            console.log(data);
        };

        return () => {
            if (ws.readyState === 1) {
                ws.close();
            }
        };
    });

    const submit = async () => {
        const data = {
            userUuid: $userUuid,
            text: questionText,
        };

        try {
            const response = await sendQuestion(data);
            handleResponse(response);
        } catch (error) {
            errorMessage = error.message;
        }
    };

    const sendQuestion = async (data) => {
        return await fetch(`/api/courses/${course.id}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    };

    const handleResponse = (response) => {
        if (!response.ok) {
            throw new Error(
                response.status === 429
                    ? "You can only create one question per minute."
                    : "An error occurred, please try again.",
            );
        }

        questionText = "";
        fetchData();
    };
</script>

<!-- <ul>
    {#each events as event}
        <li>{event}</li>
    {/each}
</ul> -->

<h2 class="text-center text-2xl">{course.name}</h2>
<textarea
    id="questionText"
    bind:value={questionText}
    rows="5"
    cols="50"
    class="form-textarea m-5 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-md leading-6"
    placeholder="Your question"
/>
<button
    id="submitBtn"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded m-4"
    on:click={submit}
>
    Create question
</button>

{#if errorMessage}
    <p class="error-message">{errorMessage}</p>
{/if}

<ul>
    {#each data as question}
        <QuestionCard {question} courseId={course.id} client:load />
    {/each}
</ul>
