export default function AddContractor() {
    return (
      <div className="max-w-3xl space-y-6">
        <h2 className="text-xl font-semibold">Add Contractor</h2>
  
        <form className="bg-white border rounded p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contractor Name
            </label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
  
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contact Number
            </label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
  
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input type="email" className="w-full border rounded px-3 py-2" />
          </div>
  
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Office Address
            </label>
            <textarea
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>
  
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contractor Status
            </label>
            <select className="w-full border rounded px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
  
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1F4E79] text-white rounded"
            >
              Save Contractor
            </button>
          </div>
        </form>
      </div>
    );
  }
  