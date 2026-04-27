    (function() {
      const es = new EventSource('/events');
      es.onmessage = function(e) {
        if (e.data === 'reload') location.reload();
      };
    })();

