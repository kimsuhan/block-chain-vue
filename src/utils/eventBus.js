import { ethers } from "ethers";
import { ref } from "vue";
import { erc20Abi } from "../const/erc20.abi.js";
// 전역 상태 - 브라우저 새로고침 시에도 유지되도록 localStorage 사용
const getInitialState = () => {
  try {
    const saved = localStorage.getItem("walletState");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        account: parsed.account || "",
        isConnected: parsed.isConnected || false,
        balance: parsed.balance || "",
        tokenBalance: parsed.tokenBalance || "",
        totalSupply: parsed.totalSupply || 0,
        lwhTokenBalance: parsed.lwhTokenBalance || 0,
      };
    }
  } catch (error) {
    console.error("localStorage 파싱 오류:", error);
  }

  return {
    account: "",
    isConnected: false,
    balance: "",
    tokenBalance: "",
    totalSupply: 0,
    lwhTokenBalance: 0,
  };
};

export const walletState = ref(getInitialState());

// 전역 Provider와 Signer
export let globalProvider;
export let globalSigner;

// 전역 Contract 인스턴스들
export let kshTokenContract;
export let lwhTokenContract;
export let dexContract;

// 이벤트 버스
export const eventBus = {
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  },

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  },
};

// 지갑 상태 업데이트 함수
export const updateWalletState = (newState) => {
  Object.assign(walletState.value, newState);

  // localStorage에 상태 저장
  try {
    localStorage.setItem("walletState", JSON.stringify(walletState.value));
  } catch (error) {
    console.error("localStorage 저장 오류:", error);
  }

  eventBus.emit("walletStateChanged", walletState.value);
};

// 전역 Provider와 Signer 설정 함수
export const setupGlobalProvider = async (account) => {
  try {
    // Provider 설정
    globalProvider = new ethers.JsonRpcProvider("http://localhost:8545");

    // Signer 설정
    globalSigner = await globalProvider.getSigner(account);
    kshTokenContract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      erc20Abi,
      globalSigner
    );

    lwhTokenContract = new ethers.Contract(
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      erc20Abi,
      globalSigner
    );

    console.log("전역 Provider와 Signer 설정 완료");
    return true;
  } catch (error) {
    console.error("전역 Provider 설정 실패:", error);
    return false;
  }
};

// 전역 상태 초기화 함수
export const resetGlobalState = () => {
  globalProvider = null;
  globalSigner = null;
  kshTokenContract = null;
  lwhTokenContract = null;
  dexContract = null;

  updateWalletState({
    account: "",
    isConnected: false,
    balance: "",
    tokenBalance: "",
    totalSupply: 0,
    lwhTokenBalance: 0,
  });
};
