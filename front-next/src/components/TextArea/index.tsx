import { TextareaHTMLAttributes } from 'react';
import Button from '../Button';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSubmit: () => void;
}
export default function TextArea({ id, onSubmit, disabled, ...rest }: TextAreaProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor={id} className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name={id}
              id={id}
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              {...rest}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <Button
                disabled={!(rest.value as string).trim()}
                text="Comment"
                onClick={onSubmit}
                isLoading={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
