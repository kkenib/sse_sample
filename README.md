# sse_sample


Server-Sent Event는 Server와 Client가 최초에 연결(Connection) 수립 후 Server에서 Client의 단방향으로 데이터를 송신합니다.
Client는 Server에게 따로 Response를 보내지 않아도 됩니다.


SSE를 위해 Content-Type이 ![#f03c15]`text/event-stream`으로 설정되는 것을 확인할 수 있습니다.
