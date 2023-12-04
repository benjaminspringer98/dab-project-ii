<script>
    import { userUuid } from "../stores/stores.js";

    export let course;

    let questionTitle = "";
    let questionText = "";
    let errorMessage = "";

    const submit = async () => {
        const data = {
            userUuid: $userUuid,
            title: questionTitle,
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
            let message;
            switch (response.status) {
                case 400:
                    message = "Please fill in all fields.";
                    break;
                case 429:
                    message =
                        "You can only create one question/answer per minute.";
                    break;
                default:
                    message = "An error occurred, please try again.";
            }

            throw new Error(message);
        }

        questionTitle = "";
        questionText = "";
        errorMessage = "";
    };
</script>

<input
    id="questionTitle"
    bind:value={questionTitle}
    placeholder="Title"
    class="m-5 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-md leading-6 focus:outline-none focus:ring-2 focus:ring-violet-700"
/>

<textarea
    id="questionText"
    bind:value={questionText}
    rows="5"
    cols="50"
    class="form-textarea m-5 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 text-md leading-6 focus:outline-none focus:ring-2 focus:ring-violet-700"
    placeholder="Your question"
/>
<button
    id="submitBtn"
    class="bg-violet-500 hover:bg-violet-700 text-white font-bold p-3 rounded m-4"
    on:click={submit}
>
    Create question
</button>

{#if errorMessage}
    <p class="p-4 m-4 text-sm text-red-800 rounded-lg bg-red-50">
        {errorMessage}
    </p>
{/if}
