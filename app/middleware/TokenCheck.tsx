import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

const useTokenCheck = async () => {
    const router = useRouter();
    try {
        const accToken = Cookies.get("accessToken");
        if (!accToken || accToken.length == 0) {
            router.push("/login");
        }
    } catch (err) {
        console.log(err);
    }
};

export default useTokenCheck;
