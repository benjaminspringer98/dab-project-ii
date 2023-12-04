# Performance test results

## Options

- 10 concurrent users
- 10 sec duration

## With Docker compose dev config

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

## With Docker ompose prod config

1. Loading main page (GET "/") \
     data_received..................: 94 MB  9.3 MB/s
     data_sent......................: 1.6 MB 157 kB/s
     http_req_blocked...............: med=1µs      p(99)=4µs    
     http_req_connecting............: med=0s       p(99)=0s     
     http_req_duration..............: med=4.46ms   p(99)=10.49ms
       { expected_response:true }...: med=4.46ms   p(99)=10.49ms
     http_req_failed................: 0.00%  ✓ 0           ✗ 19598
     http_req_receiving.............: med=698.49µs p(99)=3.53ms 
     http_req_sending...............: med=3µs      p(99)=23µs   
     http_req_tls_handshaking.......: med=0s       p(99)=0s     
     http_req_waiting...............: med=3.16ms   p(99)=9.89ms 
     http_reqs......................: 19598  1959.096488/s
     iteration_duration.............: med=4.48ms   p(99)=10.53ms
     iterations.....................: 19598  1959.096488/s
     vus............................: 10     min=10        max=10 
     vus_max........................: 10     min=10        max=10 
2. Loading course page (GET "/courses/cId") \
     data_received..................: 88 MB  8.8 MB/s
     data_sent......................: 1.4 MB 140 kB/s
     http_req_blocked...............: med=1µs    p(99)=4µs    
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=5.87ms p(99)=11.16ms
       { expected_response:true }...: med=5.87ms p(99)=11.16ms
     http_req_failed................: 0.00%  ✓ 0           ✗ 15768
     http_req_receiving.............: med=844µs  p(99)=5.73ms 
     http_req_sending...............: med=4µs    p(99)=21µs   
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=3.89ms p(99)=10.15ms
     http_reqs......................: 15768  1576.213018/s
     iteration_duration.............: med=5.89ms p(99)=11.21ms
     iterations.....................: 15768  1576.213018/s
     vus............................: 10     min=10        max=10 
     vus_max........................: 10     min=10        max=10 
3. Loading question page (GET "/courses/cId/questions/qId") \
     data_received..................: 78 MB  7.8 MB/s
     data_sent......................: 1.2 MB 125 kB/s
     http_req_blocked...............: med=1µs    p(99)=5µs    
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=8.72ms p(99)=17ms   
       { expected_response:true }...: med=8.72ms p(99)=17ms   
     http_req_failed................: 0.00%  ✓ 0          ✗ 12375
     http_req_receiving.............: med=360µs  p(99)=5.05ms 
     http_req_sending...............: med=5µs    p(99)=28.25µs
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=7.65ms p(99)=15.45ms
     http_reqs......................: 12375  1236.43197/s
     iteration_duration.............: med=8.76ms p(99)=17.05ms
     iterations.....................: 12375  1236.43197/s
     vus............................: 10     min=10       max=10 
     vus_max........................: 10     min=10       max=10 
4. Submit question (POST "/api/courses/cId/questions") \
     data_received..................: 2.3 MB 226 kB/s
     data_sent......................: 2.7 MB 268 kB/s
     http_req_blocked...............: med=2µs    p(99)=9µs    
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=7.99ms p(99)=19.3ms 
       { expected_response:true }...: med=7.99ms p(99)=19.3ms 
     http_req_failed................: 0.00%  ✓ 0           ✗ 11313
     http_req_receiving.............: med=28µs   p(99)=92µs   
     http_req_sending...............: med=10µs   p(99)=38µs   
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=7.94ms p(99)=19.23ms
     http_reqs......................: 11313  1130.330967/s
     iteration_duration.............: med=8.14ms p(99)=19.49ms
     iterations.....................: 11313  1130.330967/s
     vus............................: 10     min=10        max=10 
     vus_max........................: 10     min=10        max=10 
5. Submit answer (POST "/api/courses/cId/questions/qId/answers") \
     data_received..................: 1.6 MB 158 kB/s
     data_sent......................: 1.8 MB 178 kB/s
     http_req_blocked...............: med=2µs     p(99)=7µs    
     http_req_connecting............: med=0s      p(99)=0s     
     http_req_duration..............: med=12ms    p(99)=26.45ms
       { expected_response:true }...: med=12ms    p(99)=26.45ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 7914
     http_req_receiving.............: med=30µs    p(99)=97.86µs
     http_req_sending...............: med=11µs    p(99)=39µs   
     http_req_tls_handshaking.......: med=0s      p(99)=0s     
     http_req_waiting...............: med=11.96ms p(99)=26.4ms 
     http_reqs......................: 7914   790.312688/s
     iteration_duration.............: med=12.16ms p(99)=26.73ms
     iterations.....................: 7914   790.312688/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10
     
## With Kubernetes (Minikube)

1. Loading main page (GET "/") \
     data_received..................: 27 MB  2.7 MB/s
     data_sent......................: 448 kB 45 kB/s
     http_req_blocked...............: med=1µs     p(99)=5µs    
     http_req_connecting............: med=0s      p(99)=0s     
     http_req_duration..............: med=5.46ms  p(99)=86.94ms
       { expected_response:true }...: med=5.46ms  p(99)=86.94ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 5600
     http_req_receiving.............: med=659.5µs p(99)=72.22ms
     http_req_sending...............: med=5µs     p(99)=24µs   
     http_req_tls_handshaking.......: med=0s      p(99)=0s     
     http_req_waiting...............: med=4.41ms  p(99)=84.49ms
     http_reqs......................: 5600   557.966991/s
     iteration_duration.............: med=5.49ms  p(99)=86.97ms
     iterations.....................: 5600   557.966991/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10
2. Loading course page (GET "/courses/cId") \
     data_received..................: 35 MB  3.5 MB/s
     data_sent......................: 551 kB 55 kB/s
     http_req_blocked...............: med=1µs    p(99)=4µs    
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=5.96ms p(99)=79.71ms
       { expected_response:true }...: med=5.96ms p(99)=79.71ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 6193
     http_req_receiving.............: med=1.27ms p(99)=68.09ms
     http_req_sending...............: med=5µs    p(99)=21µs   
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=4.27ms p(99)=77.57ms
     http_reqs......................: 6193   617.183616/s
     iteration_duration.............: med=6ms    p(99)=79.77ms
     iterations.....................: 6193   617.183616/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10
3. Loading question page (GET "/courses/cId/questions/qId") \
     data_received..................: 33 MB  3.3 MB/s
     data_sent......................: 525 kB 52 kB/s
     http_req_blocked...............: med=1µs    p(99)=4.07µs 
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=6.43ms p(99)=96.4ms 
       { expected_response:true }...: med=6.43ms p(99)=96.4ms 
     http_req_failed................: 0.00%  ✓ 0          ✗ 5193
     http_req_receiving.............: med=1.59ms p(99)=75.7ms 
     http_req_sending...............: med=5µs    p(99)=22µs   
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=4.54ms p(99)=89.49ms
     http_reqs......................: 5193   516.608418/s
     iteration_duration.............: med=6.46ms p(99)=96.43ms
     iterations.....................: 5193   516.608418/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10
4. Submit question (POST "/api/courses/cId/questions") \
     data_received..................: 1.4 MB 136 kB/s
     data_sent......................: 1.6 MB 161 kB/s
     http_req_blocked...............: med=1µs    p(99)=4µs    
     http_req_connecting............: med=0s     p(99)=0s     
     http_req_duration..............: med=7.43ms p(99)=66.36ms
       { expected_response:true }...: med=7.43ms p(99)=66.36ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 6818
     http_req_receiving.............: med=19µs   p(99)=71µs   
     http_req_sending...............: med=8µs    p(99)=24µs   
     http_req_tls_handshaking.......: med=0s     p(99)=0s     
     http_req_waiting...............: med=7.4ms  p(99)=66.31ms
     http_reqs......................: 6818   680.004652/s
     iteration_duration.............: med=7.56ms p(99)=66.5ms 
     iterations.....................: 6818   680.004652/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10
5. Submit answer (POST "/api/courses/cId/questions/qId/answers") \
     data_received..................: 1.1 MB 107 kB/s
     data_sent......................: 1.2 MB 120 kB/s
     http_req_blocked...............: med=1µs     p(99)=5µs    
     http_req_connecting............: med=0s      p(99)=0s     
     http_req_duration..............: med=11ms    p(99)=67ms   
       { expected_response:true }...: med=11ms    p(99)=67ms   
     http_req_failed................: 0.00%  ✓ 0          ✗ 5348
     http_req_receiving.............: med=21µs    p(99)=84µs   
     http_req_sending...............: med=8µs     p(99)=30.52µs
     http_req_tls_handshaking.......: med=0s      p(99)=0s     
     http_req_waiting...............: med=10.96ms p(99)=66.95ms
     http_reqs......................: 5348   533.265103/s
     iteration_duration.............: med=11.11ms p(99)=67.2ms 
     iterations.....................: 5348   533.265103/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10