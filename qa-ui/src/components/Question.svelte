<script>
    export let courseId;
    export let question;

    import { userUuid } from "../stores/stores.js";
    import AnswerCard from "./AnswerCard.svelte";

    let answerText = "";

    const submit = async () => {
        const data = {
            userUuid: $userUuid,
            text: answerText,
        };

        const response = await fetch(
            `/api/courses/${courseId}/questions/${question.id}/answers`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        answerText = "";
        answerPromise = getAnswers();
    };

    const getAnswers = async () => {
        const response = await fetch(
            `/api/courses/${courseId}/questions/${question.id}/answers`
        );
        return await response.json();
    };

    let answerPromise = getAnswers();
</script>

<p id="questionText" class="text-lg">{question.text}</p>
<textarea
    id="answerText"
    bind:value={answerText}
    rows="5"
    cols="50"
    class="form-textarea m-5 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-md leading-6"
    placeholder="Your answer"
/>
<button
    id="submitBtn"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded m-4"
    on:click={submit}
>
    Create answer
</button>

<!-- <QuestionsList courseId={course.id} /> -->

{#await answerPromise}
    <p>Loading...</p>
{:then answers}
    {#each answers as answer}
        <!-- <QuestionCard {question} courseId={course.id} client:load /> -->
        <AnswerCard {answer} {courseId} questionId={question.id} client:load />
    {/each}
{:catch error}
    <p>{error.message}</p>
{/await}
