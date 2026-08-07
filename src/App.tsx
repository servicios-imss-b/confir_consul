import { useState } from 'react';
import { STATES } from '@/data/states';
import { CATALOGO_UNIDADES } from '@/data/catalogoUnidades';
import { StatesPage } from '@/pages/StatesPage';
import { StateIntroPage } from '@/pages/StateIntroPage';
import { QuestionnairePage } from '@/pages/QuestionnairePage';

type View =
  | { type: 'states' }
  | { type: 'state-intro'; stateId: string }
  | { type: 'questionnaire'; stateId: string; entityName: string; email: string };

// Solo estados que tienen CLUES en la base
const ESTADOS_ACTIVOS = STATES.filter(s => (CATALOGO_UNIDADES[s.id]?.length ?? 0) > 0);

function App() {
  const [view, setView] = useState<View>({ type: 'states' });

  if (view.type === 'states') {
    return (
      <StatesPage
        states={ESTADOS_ACTIVOS}
        onSelectState={(stateId) => setView({ type: 'state-intro', stateId })}
      />
    );
  }

  if (view.type === 'state-intro') {
    const state = STATES.find((s) => s.id === view.stateId);
    if (!state) return null;
    return (
      <StateIntroPage
        state={state}
        onBack={() => setView({ type: 'states' })}
        onContinue={(entityName, email) =>
          setView({ type: 'questionnaire', stateId: state.id, entityName, email })
        }
      />
    );
  }

  // questionnaire
  const state = STATES.find((s) => s.id === view.stateId);
  if (!state) return null;
  return (
    <QuestionnairePage
      state={state}
      entityName={view.entityName}
      email={view.email}
      onBack={() => setView({ type: 'state-intro', stateId: state.id })}
    />
  );
}

export default App;
