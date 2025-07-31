import styles from './option1.module.css';


export function InsuranceCarriers() {
    return (
        <>

            {/* Policy Input Form */}
            <div className={styles.policyEntryContainer}>
                <h2>Policy Entry
                </h2>
                <form >
                    <div>
                        <label htmlFor="policyNumber" >Policy Number</label>
                        <input
                            type="text"
                            id="policyNumber"
                            name="policyNumber"

                            placeholder="e.g., COMM-PL-7890"
                            required

                        />
                    </div>

                    <div>
                        <label htmlFor="insuranceCarrier" >Insurance Carrier</label>
                        <select
                            id="insuranceCarrier"
                            name="insuranceCarrier"

                            required
                        >
                            <option value="">Select a Carrier</option>

                        </select>
                    </div>

                    <div>
                        <label htmlFor="policyCategory" >Policy Category</label>
                        <select // Changed to select dropdown
                            id="policyCategory"
                            name="policyCategory"

                            required
                        >
                            <option value="">Select a Category</option>

                        </select>
                    </div>

                    <div>
                        <label htmlFor="propertyType" >Property Type</label>
                        <select
                            id="propertyType"
                            name="propertyType"

                            required
                        >
                            <option value="">Select a Property Type</option>

                        </select>
                    </div>

                    <div>
                        <label htmlFor="propertySizeSqFt" >Property Size (Sq. Ft.)</label>
                        <input
                            type="number"
                            id="propertySizeSqFt"
                            name="propertySizeSqFt"

                            placeholder="e.g., 25000"
                            required

                        />
                    </div>

                    <div>
                        <label htmlFor="premium" >Premium ($)</label>
                        <input
                            type="number"
                            id="premium"
                            name="premium"

                            placeholder="e.g., 1200.50"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="startDate" >Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"

                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" >End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"

                            required

                        />
                    </div>

                    <div className={styles.textareaContainer} >
                        <label htmlFor="coverageDescription" >Coverage Description</label>
                        <textarea
                            id="coverageDescription"
                            name="coverageDescription"

                            placeholder="e.g., Covers fire, theft, and natural disasters for commercial properties over 20,000 sq ft. Excludes flood damage."
                            rows="3"
                            required

                        ></textarea>
                    </div>
                    <div className={styles.formSubmitContainer}>
                        <button
                            type="submit"

                            disabled={false}
                        >
                            Add Policy Entry
                        </button>

                    </div>
                </form>
            </div>

        </>
    )
}









