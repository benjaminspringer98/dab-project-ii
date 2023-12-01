<script>
    export let courseId;
    export let question;

    import { userUuid } from "../stores/stores.js";
    import { onMount } from "svelte";
    import AnswerCard from "./AnswerCard.svelte";

    let page = 1;
    let data = [];
    let newBatch = [];
    let hasMoreData = true;
    const offset = 200; // Pixels from the bottom of the page to trigger data fetch

    let answerText = "";
    let errorMessage = "";

    let ws;

    async function fetchData() {
        if (!hasMoreData) return; // Prevent fetching if no more data is available

        const response = await fetch(
            `/api/courses/${courseId}/questions/${question.id}/answers?page=${page}`,
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

        window.addEventListener("scroll", () => {
            if (
                document.body.scrollHeight > window.innerHeight && // Check if the content is taller than the viewport
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
            "ws://" + host + `:7800/api/ws/questions/${question.id}`,
        );

        ws.onmessage = (event) => {
            console.log(event.data);
            const answer = JSON.parse(event.data);
            data = [answer, ...data];
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
            text: answerText,
        };

        try {
            const response = await sendAnswer(data);
            handleResponse(response);
        } catch (error) {
            errorMessage = error.message;
        }
    };

    const sendAnswer = async (data) => {
        return await fetch(
            `/api/courses/${courseId}/questions/${question.id}/answers`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
    };

    const handleResponse = (response) => {
        if (!response.ok) {
            throw new Error(
                response.status === 429
                    ? "You can only create one answer per minute."
                    : "An error occurred, please try again.",
            );
        }

        answerText = "";
    };
</script>

<p id="questionText" class="text-xl">{question.text}</p>
<textarea
    id="answerText"
    bind:value={answerText}
    rows="5"
    cols="50"
    class="form-textarea m-5 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-md leading-6 focus:outline-none focus:ring-2 focus:ring-violet-700"
    placeholder="Your answer"
/>
<button
    id="submitBtn"
    class="bg-violet-500 hover:bg-violet-700 text-white font-bold p-3 rounded m-4"
    on:click={submit}
>
    Add answer
</button>

{#if errorMessage}
    <p class="error-message">{errorMessage}</p>
{/if}

<ul>
    {#each data as answer}
        <AnswerCard {answer} {courseId} questionId={question.id} client:load />
    {/each}
</ul>
