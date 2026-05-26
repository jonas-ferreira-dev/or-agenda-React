import type { PublicAvailableSlot } from '../types/public-booking';

type PublicSlotsProps = {
  slots: PublicAvailableSlot[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
};

export function PublicSlots({
  slots,
  selectedSlot,
  onSelect,
}: PublicSlotsProps) {
  if (!slots.length) {
    return (
      <div className="public-empty-state">
        <p>Nenhum horário disponível para esta data.</p>
      </div>
    );
  }

  return (
    <div className="public-slots-grid">
      {slots.map((slot) => (
        <button
          key={`${slot.start_time}-${slot.end_time}`}
          type="button"
          className={`public-slot-button ${
            selectedSlot === slot.start_time ? 'selected' : ''
          }`}
          onClick={() => onSelect(slot.start_time)}
        >
          {slot.start_time}
        </button>
      ))}
    </div>
  );
}