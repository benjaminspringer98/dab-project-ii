TODO: There are at least five (meaningful) performance tests written with k6, included in the k6 folder. Performance test results are included in the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.

# Performance test results

## Options

- 10 concurrent users
- 10 sec duration

## Performance (with dev config)

1. Loading main page (GET "/")

2. Loading course page (GET "/courses/cId")

3. Loading question page (GET "/courses/cId/questions/qId")

4. Submit question (POST "/api/courses/cId/questions")

5. Submit answer (POST "/api/courses/cId/questions/qId/answers")