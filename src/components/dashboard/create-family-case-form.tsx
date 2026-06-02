"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createFamilyCase } from "@/lib/dashboard/family-case-actions";
import {
  australianStateOptions,
  currentStatusOptions,
  type FamilyCaseActionState,
  livingSituationOptions,
  relationshipOptions,
} from "@/lib/dashboard/types";

const initialState: FamilyCaseActionState = {
  status: "idle",
};

const inputClass =
  "mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20";

const selectClass =
  "mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-[#146c60] focus:ring-2 focus:ring-[#146c60]/20";

export function CreateFamilyCaseForm() {
  const [state, formAction] = useActionState(createFamilyCase, initialState);

  return (
    <form action={formAction} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-stone-950">Create family case</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Add a few basics about the person you are helping. KinHarbour uses this to
          organise the family journey; it does not determine aged care eligibility.
        </p>
      </div>

      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950"
              : "mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2" htmlFor="care_recipient_name">
          <span className="text-sm font-semibold text-stone-700">
            Care recipient first name or nickname
          </span>
          <input
            id="care_recipient_name"
            name="care_recipient_name"
            type="text"
            autoComplete="off"
            className={inputClass}
            aria-describedby="care_recipient_name_error"
          />
          <FieldError id="care_recipient_name_error" message={state.fieldErrors?.care_recipient_name} />
        </label>

        <label className="block" htmlFor="relationship_to_user">
          <span className="text-sm font-semibold text-stone-700">Relationship to you</span>
          <select
            id="relationship_to_user"
            name="relationship_to_user"
            defaultValue=""
            className={selectClass}
            aria-describedby="relationship_to_user_error"
          >
            <option value="" disabled>
              Choose relationship
            </option>
            {relationshipOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id="relationship_to_user_error" message={state.fieldErrors?.relationship_to_user} />
        </label>

        <label className="block" htmlFor="care_recipient_state">
          <span className="text-sm font-semibold text-stone-700">State or territory</span>
          <select
            id="care_recipient_state"
            name="care_recipient_state"
            defaultValue=""
            className={selectClass}
            aria-describedby="care_recipient_state_error"
          >
            <option value="" disabled>
              Choose state
            </option>
            {australianStateOptions.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption}
              </option>
            ))}
          </select>
          <FieldError id="care_recipient_state_error" message={state.fieldErrors?.care_recipient_state} />
        </label>

        <label className="block md:col-span-2" htmlFor="care_recipient_suburb">
          <span className="text-sm font-semibold text-stone-700">Suburb optional</span>
          <input
            id="care_recipient_suburb"
            name="care_recipient_suburb"
            type="text"
            autoComplete="address-level2"
            className={inputClass}
            aria-describedby="care_recipient_suburb_error"
          />
          <FieldError id="care_recipient_suburb_error" message={state.fieldErrors?.care_recipient_suburb} />
        </label>

        <label className="block" htmlFor="current_living_situation">
          <span className="text-sm font-semibold text-stone-700">Current living situation</span>
          <select
            id="current_living_situation"
            name="current_living_situation"
            defaultValue=""
            className={selectClass}
            aria-describedby="current_living_situation_error"
          >
            <option value="" disabled>
              Choose situation
            </option>
            {livingSituationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError
            id="current_living_situation_error"
            message={state.fieldErrors?.current_living_situation}
          />
        </label>

        <label className="block" htmlFor="current_status">
          <span className="text-sm font-semibold text-stone-700">Current status</span>
          <select
            id="current_status"
            name="current_status"
            defaultValue=""
            className={selectClass}
            aria-describedby="current_status_error"
          >
            <option value="" disabled>
              Choose status
            </option>
            {currentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id="current_status_error" message={state.fieldErrors?.current_status} />
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-md bg-[#146c60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5148] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Creating family case..." : "Create family case"}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm font-medium text-rose-700">
      {message}
    </p>
  );
}
