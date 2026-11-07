import { asset } from '../lib/asset';
/** Vasu's mascot. Purely a picture: no dragging, no poking. */
export function Mascot() {
  return (
    <div className="mascot">
      <img src={asset('img/mascot.webp')} alt="Vasu's mascot" width={640} height={618} draggable={false} />
    </div>
  );
}
