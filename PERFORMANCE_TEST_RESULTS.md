# Performance test results

## Options

- 10 concurrent users
- 10 sec duration

## With docker compose dev config

1. Loading main page (GET "/") \
     data_received..................: 98 MB  9.8 MB/s
     data_sent......................: 376 kB 38 kB/s
     http_req_blocked...............: med=1µs     p(99)=5µs    
     http_req_connecting............: med=0s      p(99)=0s     
     http_req_duration..............: med=19.16ms p(99)=65.6ms 
       { expected_response:true }...: med=19.16ms p(99)=65.6ms 
     http_req_failed................: 0.00%  ✓ 0          ✗ 4701
     http_req_receiving.............: med=45µs    p(99)=290µs  
     http_req_sending...............: med=5µs     p(99)=21µs   
     http_req_tls_handshaking.......: med=0s      p(99)=0s     
     http_req_waiting...............: med=19.11ms p(99)=65.15ms
     http_reqs......................: 4701   469.497072/s
     iteration_duration.............: med=19.19ms p(99)=67.02ms
     iterations.....................: 4701   469.497072/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10
2. Loading course page (GET "/courses/cId") \
     data_received..................: 69 MB  6.8 MB/s
     data_sent......................: 283 kB 28 kB/s
     http_req_blocked...............: med=2µs     p(99)=7.25µs  
     http_req_connecting............: med=0s      p(99)=0s      
     http_req_duration..............: med=29.15ms p(99)=75.21ms 
       { expected_response:true }...: med=29.15ms p(99)=75.21ms 
     http_req_failed................: 0.00%  ✓ 0         ✗ 3175
     http_req_receiving.............: med=52µs    p(99)=263.52µs
     http_req_sending...............: med=7µs     p(99)=25µs    
     http_req_tls_handshaking.......: med=0s      p(99)=0s      
     http_req_waiting...............: med=29.09ms p(99)=75.15ms 
     http_reqs......................: 3175   316.68498/s
     iteration_duration.............: med=29.19ms p(99)=75.26ms 
     iterations.....................: 3175   316.68498/s
     vus............................: 10     min=10      max=10
     vus_max........................: 10     min=10      max=10

3. Loading question page (GET "/courses/cId/questions/qId") \
     data_received..................: 71 MB  7.1 MB/s
     data_sent......................: 327 kB 33 kB/s
     http_req_blocked...............: med=2µs     p(99)=7µs     
     http_req_connecting............: med=0s      p(99)=0s      
     http_req_duration..............: med=28.6ms  p(99)=74ms    
       { expected_response:true }...: med=28.6ms  p(99)=74ms    
     http_req_failed................: 0.00%  ✓ 0          ✗ 3241
     http_req_receiving.............: med=54µs    p(99)=263.99µs
     http_req_sending...............: med=8µs     p(99)=24.59µs 
     http_req_tls_handshaking.......: med=0s      p(99)=0s      
     http_req_waiting...............: med=28.53ms p(99)=73.78ms 
     http_reqs......................: 3241   323.317571/s
     iteration_duration.............: med=28.63ms p(99)=75.24ms 
     iterations.....................: 3241   323.317571/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10

4. Submit question (POST "/api/courses/cId/questions") \
     data_received..................: 2.4 MB 239 kB/s
     data_sent......................: 2.8 MB 283 kB/s
     http_req_blocked...............: med=1µs    p(99)=7.45µs 
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=7.26ms p(99)=27.71ms
       { expected_response:true }...: med=7.26ms p(99)=27.71ms
     http_req_failed................: 0.00%  ✓ 0           ✗ 11955
     http_req_receiving.............: med=25µs   p(99)=99.45µs
     http_req_sending...............: med=6µs    p(99)=37µs   
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=7.23ms p(99)=27.65ms
     http_reqs......................: 11955  1194.957489/s
     iteration_duration.............: med=7.36ms p(99)=27.85ms
     iterations.....................: 11955  1194.957489/s
     vus............................: 10     min=10        max=10 
     vus_max........................: 10     min=10        max=10 

5. Submit answer (POST "/api/courses/cId/questions/qId/answers") \
     data_received..................: 1.7 MB 170 kB/s
     data_sent......................: 1.9 MB 191 kB/s
     http_req_blocked...............: med=1µs     p(99)=8µs    
     http_req_connecting............: med=0s      p(99)=0s     
     http_req_duration..............: med=10.52ms p(99)=37.47ms
       { expected_response:true }...: med=10.52ms p(99)=37.47ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 8485
     http_req_receiving.............: med=27µs    p(99)=112µs  
     http_req_sending...............: med=8µs     p(99)=38µs   
     http_req_tls_handshaking.......: med=0s      p(99)=0s     
     http_req_waiting...............: med=10.46ms p(99)=37.4ms 
     http_reqs......................: 8485   847.445439/s
     iteration_duration.............: med=10.64ms p(99)=37.78ms
     iterations.....................: 8485   847.445439/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10

## With docker compose prod config
1. Loading main page (GET "/") \

2. Loading course page (GET "/courses/cId") \


3. Loading question page (GET "/courses/cId/questions/qId") \


4. Submit question (POST "/api/courses/cId/questions") \


5. Submit answer (POST "/api/courses/cId/questions/qId/answers") \
