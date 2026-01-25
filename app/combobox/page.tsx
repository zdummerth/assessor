import ExampleAsyncMultipleCombobox from "@/components/ui/comboboxes/async-search-multi";
import ExampleAsyncSingleCombobox from "@/components/ui/comboboxes/async-search-single";
import ExampleCombobox from "@/components/ui/comboboxes/basic";
import ExampleCreatableCombobox from "@/components/ui/comboboxes/creatable";
import { de } from "date-fns/locale";

export default function ComboboxPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Basic Combobox</h2>
        <ExampleCombobox />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Creatable Combobox</h2>
        <ExampleCreatableCombobox />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Async Single Select Combobox</h2>
        <ExampleAsyncSingleCombobox />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Async Multi Select Combobox</h2>
        <ExampleAsyncMultipleCombobox />
      </section>
    </div>
  );
}
