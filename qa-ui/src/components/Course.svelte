<script>
    export let course;
    import { userUuid } from "../stores/stores.js";
    import QuestionsList from "./QuestionsList.svelte";
    import QuestionCard from "./QuestionCard.svelte";

    let questionText = "";
    let errorMessage = "";

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
        questionsPromise = getQuestions();
    };

    const getQuestions = async () => {
        const response = await fetch(`/api/courses/${course.id}/questions`);
        return await response.json();
    };

    let questionsPromise = getQuestions();
</script>

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

<!-- <QuestionsList courseId={course.id} /> -->

{#if errorMessage}
    <p class="error-message">{errorMessage}</p>
{/if}

{#await questionsPromise}
    <p>Loading...</p>
{:then questions}
    {#each questions as question}
        <QuestionCard {question} courseId={course.id} client:load />
    {/each}
{:catch error}
    <p>{error.message}</p>
{/await}
