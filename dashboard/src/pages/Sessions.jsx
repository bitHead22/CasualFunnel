import { useState } from 'react';
import SessionsTable from '../components/SessionsTable';
import EventJourney from '../components/EventJourney';

export default function Sessions() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <>
      <div className="page-header">
        <h1>Sessions</h1>
        <p>Every unique visitor session — click a row to explore the event journey.</p>
      </div>

      <SessionsTable onSelectSession={setSelectedSessionId} />

      {selectedSessionId && (
        <EventJourney
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </>
  );
}
