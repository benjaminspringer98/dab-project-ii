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

        let lastFetchTime = 0;
        const fetchInterval = 1000;

        window.addEventListener("scroll", () => {
            const currentTime = new Date().getTime();
            if (
                currentTime - lastFetchTime > fetchInterval && // Prevent fetching too often
                window.innerHeight + window.scrollY >=
                    document.body.scrollHeight - offset &&
                hasMoreData
            ) {
                lastFetchTime = currentTime;
                page++;
                fetchData();
            }
        });

        const host = window.location.hostname;
        ws = new WebSocket(
            "ws://" + host + `:7800/api/ws/questions/${question.id}`,
        );

        ws.onmessage = (event) => {
            const answer = JSON.parse(event.data);
            data = [answer, ...data];
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
            let message;
            switch (response.status) {
                case 400:
                    message = "Please fill in all fields.";
                    break;
                case 429:
                    message = "You can only create one question per minute.";
                    break;
                default:
                    message = "An error occurred, please try again.";
            }

            throw new Error(message);
        }

        answerText = "";
        errorMessage = "";
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
    <p class="p-4 m-4 text-sm text-red-800 rounded-lg bg-red-50">
        {errorMessage}
    </p>
{/if}

<ul>
    {#each data as answer}
        <AnswerCard {answer} {courseId} questionId={question.id} client:load />
    {/each}
</ul>
