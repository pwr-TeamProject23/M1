export const rejectionReasons = [
    { label: "Weak Motivation", value: "weak_motivation" },
    { label: "Out of scope", value: "out_of_scope" },
    { label: "Empirical Standards", value: "empirical_standards" },
    { label: "Typesetting", value: "typesetting" },
    { label: "SLR standard", value: "slr_standard" },
]

export const rejectionReasonMap: Record<string, string> = {
    weak_motivation: "the motivation of the proposed research is not rooted in the practice of software development",
    out_of_scope:
        "the topic does not fit entirely into the scope of the journal;" +
        " thus, our Editorial Board and reviewers would not be able to evaluate its merits",
    empirical_standards:
        "it does not meet the contemporary standards for research results' " +
        "validation in Software Engineering (e.g., https://github.com/acmsigsoft/EmpiricalStandards)",
    typesetting: "there are visible flaws in typesetting making the manuscript difficult to read",
    slr_standard:
        "it does not use the contemporary Software Engineering Guidelines for Reporting Secondary Studies (SEGRESS) " +
        "https://doi.org/10.1109/TSE.2022.3174092 " +
        "(or https://doi.org/10.1109/10.1109/TSE.2022.3165938 in the case of secondary studies including grey literature)",
}
