<script>
    import { onMount } from "svelte";
    import AnswerCard from "./AnswerCard.svelte";

    export let courseId;
    export let question;

    let page = 1;
    let data = [];
    let newBatch = [];
    let hasMoreData = true;
    const offset = 200; // Pixels from the bottom of the page to trigger data fetch

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
</script>

<ul>
    {#each data as answer}
        <AnswerCard {answer} {courseId} questionId={question.id} client:load />
    {/each}
</ul>
