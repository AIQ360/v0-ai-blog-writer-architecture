export default function ArticleDetails({ article }) {
  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-medium">Content Grade</h2>
          <div className="text-gray-400 rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
        </div>
        <div className="flex justify-center">
          <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-medium">
            {article.contentGrade}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium">Details</h2>
          <button className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Generated</span>
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Created by</span>
            <span className="h-6 w-6 rounded-full bg-gray-200"></span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Created</span>
            <span>May 4, 2025</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Generated</span>
            <span>May 4, 2025</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Updated</span>
            <span>May 4, 2025</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Language</span>
            <span>English (US)</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium">Stats</h2>
          <button className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium">Article Content</h2>
          <button className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
