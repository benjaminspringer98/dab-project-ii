<script>
    import { onMount } from "svelte";
    import QuestionCard from "./QuestionCard.svelte";

    export let course;

    let page = 1;
    let data = [];
    let newBatch = [];
    let hasMoreData = true;
    const offset = 200; // Pixels from the bottom of the page to trigger data fetch

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
            "ws://" + host + `:7800/api/ws/courses/${course.id}`,
        );

        ws.onmessage = (event) => {
            const question = JSON.parse(event.data);
            data = [question, ...data];
        };

        return () => {
            if (ws.readyState === 1) {
                ws.close();
            }
        };
    });
</script>

<ul>
    {#each data as question}
        <QuestionCard {question} courseId={course.id} client:load />
    {/each}
</ul>
