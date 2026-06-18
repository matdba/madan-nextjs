type CustomSwitchProps = {
  checked: boolean;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CustomSwitch({ checked, onChange }: CustomSwitchProps) {
    return (
        <label className="inline-flex cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
                onClick={(e) => e.stopPropagation()}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
    );
}