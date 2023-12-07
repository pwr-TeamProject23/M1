import Icon, { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon"
import ScholarLogoSvg from "../assets/scholar-logo.svg"
import DblpLogoSvg from "../assets/dblp-logo.svg"
import ScopusLogoSvg from "../assets/scopus-logo.svg"

export const ScholarIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={() => <img src={ScholarLogoSvg} alt="Scholar" />} {...props} />
)

export const DblpIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={() => <img src={DblpLogoSvg} alt="DBLP" />} {...props} />
)

export const ScopusIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={() => <img src={ScopusLogoSvg} alt="Scopus" />} {...props} />
)
