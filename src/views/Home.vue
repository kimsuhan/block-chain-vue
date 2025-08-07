<template>
  <div class="container-fluid p-4">
    <div class="row">
      <!-- 지갑 정보 카드 -->
      <div class="col-lg-12 col-xl-12 mb-4">
        <div class="card shadow-lg border-0 h-100">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-wallet2 me-2"></i>
              지갑 정보
            </h5>
          </div>
          <div class="card-body">
            <div v-if="!isConnected" class="text-center py-5">
              <i class="bi bi-wallet2 display-1 text-muted mb-3"></i>
              <h6 class="text-muted">지갑이 연결되지 않았습니다</h6>
              <p class="text-muted small">상단의 지갑 연결 버튼을 클릭하세요</p>
            </div>

            <div v-else>
              <div class="mb-3">
                <label class="form-label text-muted small">연결된 계정</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control font-monospace"
                    :value="account"
                    readonly
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="copyToClipboard(account)"
                  >
                    <i class="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>

              <table class="table table-bordered mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="text-center">코인</th>
                    <th class="text-center">잔액</th>
                    <th class="text-center">송금</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">ETH</td>
                    <td class="text-center fw-bold text-success">
                      {{ balance }}
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="openTransferModal('ETH')"
                      >
                        송금
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">KSH</td>
                    <td class="text-center fw-bold text-primary">
                      {{ tokenBalance }}
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="openTransferModal('KSH')"
                      >
                        송금
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">LWH</td>
                    <td class="text-center fw-bold text-primary">
                      {{ lwhTokenBalance }}
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="openTransferModal('LWH')"
                      >
                        송금
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- <div class="mt-3">
                <div class="d-grid gap-2">
                  <button @click="getTotalSupply" class="btn btn-success">
                    <i class="bi bi-graph-up me-2"></i>
                    총 공급량 조회
                  </button>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 토큰 정보 카드 -->
      <div class="col-lg-6 col-xl-4 mb-4">
        <div class="card shadow-lg border-0 h-100">
          <div class="card-header bg-info text-white py-2">
            <h6 class="card-title mb-0">
              <i class="bi bi-coin me-2"></i>
              토큰 정보
            </h6>
          </div>
          <div class="card-body py-3">
            <div class="row text-center">
              <div class="col-6 border-end">
                <div class="mb-2">
                  <i class="bi bi-coin fs-2 text-info"></i>
                </div>
                <div class="fw-semibold">KSH</div>
                <div class="text-info small mb-1">{{ totalSupply }}</div>
                <div class="text-muted" style="font-size: 0.85em">
                  총 발행량
                </div>
              </div>
              <div class="col-6">
                <div class="mb-2">
                  <i class="bi bi-coin fs-2 text-info"></i>
                </div>
                <div class="fw-semibold">LWH</div>
                <div class="text-info small mb-1">{{ lwhTokenBalance }}</div>
                <div class="text-muted" style="font-size: 0.85em">
                  총 발행량
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 토큰 전송 모달 -->
    <div
      class="modal fade"
      id="transferModal"
      tabindex="-1"
      aria-labelledby="transferModalLabel"
      aria-hidden="true"
      @click="handleModalBackdropClick"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="transferModalLabel">
              <i class="bi bi-send me-2"></i>
              {{ selectedTokenType }} 전송
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeTransferModal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label for="recipient" class="form-label fw-semibold">
                수신자 주소
              </label>
              <input
                id="recipient"
                v-model="recipientAddress"
                type="text"
                placeholder="0x..."
                class="form-control"
                :disabled="isTransferring"
              />
            </div>

            <div class="mb-3">
              <label for="amount" class="form-label fw-semibold">
                전송 금액 ({{ selectedTokenType }})
              </label>
              <input
                id="amount"
                v-model="transferAmount"
                type="number"
                placeholder="0.0"
                step="0.01"
                min="0"
                class="form-control"
                :disabled="isTransferring"
              />
              <div class="form-text">
                보유 잔액: {{ getCurrentBalance() }} {{ selectedTokenType }}
              </div>
            </div>

            <div v-if="transferError" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ transferError }}
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="closeTransferModal"
              :disabled="isTransferring"
            >
              취소
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="transferTokens"
              :disabled="isTransferring"
            >
              <span
                v-if="isTransferring"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              <span v-if="isTransferring">전송 중...</span>
              <span v-else>전송</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "bootstrap";
import { ethers } from "ethers";
import { onMounted, ref } from "vue";
import {
  eventBus,
  globalProvider,
  globalSigner,
  kshTokenContract,
  lwhTokenContract,
  resetGlobalState,
  setupGlobalProvider,
  updateWalletState,
  walletState,
} from "../utils/eventBus";

// 반응형 데이터
const account = ref("");
const isConnected = ref(false);
const balance = ref("");
const totalSupply = ref(0);
const tokenBalance = ref(0);
const lwhTokenBalance = ref(0);

// 토큰 전송 관련 상태
const recipientAddress = ref("");
const transferAmount = ref("");
const isTransferring = ref(false);
const transferError = ref("");
const selectedTokenType = ref("KSH");

// 지갑 연결 함수
const connectWallet = async () => {
  try {
    console.log("Home.vue: 지갑 연결 시작");
    // MetaMask가 설치되어 있는지 확인
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask를 설치해주세요!");
      return;
    }

    // 지갑 연결 요청
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      account.value = accounts[0];
      isConnected.value = true;

      // 전역 Provider와 Signer 설정
      const providerSetup = await setupGlobalProvider(account.value);
      if (!providerSetup) {
        throw new Error("Provider 설정 실패");
      }

      // 잔액 조회
      await getBalance();

      // 전역 상태 업데이트
      updateWalletState({
        account: account.value,
        isConnected: isConnected.value,
        balance: balance.value,
        tokenBalance: tokenBalance.value,
        totalSupply: totalSupply.value,
        lwhTokenBalance: lwhTokenBalance.value,
      });

      console.log("지갑이 연결되었습니다:", account.value);
    }
  } catch (error) {
    console.error("지갑 연결 실패:", error);
    alert("지갑 연결에 실패했습니다.");
  }
};

// 지갑 연결 해제 함수
const disconnectWallet = () => {
  account.value = "";
  isConnected.value = false;
  balance.value = "";

  // 전역 상태 초기화
  resetGlobalState();

  console.log("지갑 연결이 해제되었습니다.");
};

// 잔액 조회 함수
const getBalance = async () => {
  try {
    if (globalProvider && account.value) {
      const balanceWei = await globalProvider.getBalance(account.value);
      balance.value = ethers.formatEther(balanceWei);
    }
    if (kshTokenContract && account.value) {
      const balanceOf = await kshTokenContract.balanceOf(account.value);
      tokenBalance.value = ethers.formatEther(balanceOf.toString());
    }
    if (lwhTokenContract && account.value) {
      const balanceOf = await lwhTokenContract.balanceOf(account.value);
      lwhTokenBalance.value = ethers.formatEther(balanceOf.toString());
    }

    // 전역 상태 업데이트
    updateWalletState({
      account: account.value,
      isConnected: isConnected.value,
      balance: balance.value,
      tokenBalance: tokenBalance.value,
      totalSupply: totalSupply.value,
      lwhTokenBalance: lwhTokenBalance.value,
    });
  } catch (error) {
    console.error("잔액 조회 실패:", error);
  }
};

// 계정 변경 감지
const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    // 사용자가 지갑 연결을 해제한 경우
    disconnectWallet();
  } else if (accounts[0] !== account.value) {
    // 계정이 변경된 경우
    account.value = accounts[0];
    getBalance();
  }
};

// 네트워크 변경 감지
const handleChainChanged = () => {
  // 페이지 새로고침으로 네트워크 변경 처리
  window.location.reload();
};

// 토큰 총 공급량 조회
const getTotalSupply = async () => {
  if (kshTokenContract) {
    const totalSupplyRaw = await kshTokenContract.totalSupply();
    const totalSupplyFormatted = ethers.formatEther(totalSupplyRaw.toString());
    totalSupply.value = totalSupplyFormatted;
  }
};

// 토큰 전송 함수
const transferTokens = async () => {
  if (!recipientAddress.value || !transferAmount.value) {
    transferError.value = "수신자 주소와 전송 금액을 입력해주세요.";
    return;
  }

  // 주소 유효성 검사
  if (!ethers.isAddress(recipientAddress.value)) {
    transferError.value = "유효한 이더리움 주소를 입력해주세요.";
    return;
  }

  // 금액 유효성 검사
  const amount = parseFloat(transferAmount.value);
  if (isNaN(amount) || amount <= 0) {
    transferError.value = "유효한 전송 금액을 입력해주세요.";
    return;
  }

  // 잔액 확인
  const currentBalance = getCurrentBalance();
  if (amount > parseFloat(currentBalance)) {
    transferError.value = "전송하려는 금액이 잔액보다 큽니다.";
    return;
  }

  try {
    isTransferring.value = true;
    transferError.value = "";

    let tx;

    if (selectedTokenType.value === "ETH") {
      // ETH 전송
      const amountWei = ethers.parseEther(String(transferAmount.value));
      tx = await globalSigner.sendTransaction({
        to: recipientAddress.value,
        value: amountWei,
      });
    } else if (selectedTokenType.value === "KSH") {
      // KSH 토큰 전송
      const amountWei = ethers.parseEther(String(transferAmount.value));
      tx = await kshTokenContract.transfer(recipientAddress.value, amountWei);
    } else if (selectedTokenType.value === "LWH") {
      // LWH 토큰 전송
      const amountWei = ethers.parseEther(String(transferAmount.value));
      tx = await lwhTokenContract.transfer(recipientAddress.value, amountWei);
    }

    // 트랜잭션 완료 대기
    await tx.wait();

    // 성공 메시지
    alert(
      `토큰 전송이 완료되었습니다!\n수신자: ${recipientAddress.value}\n금액: ${transferAmount.value} ${selectedTokenType.value}`
    );

    // 모달 닫기 및 입력값 초기화
    closeTransferModal();

    // 잔액 새로고침
    await getBalance();
  } catch (error) {
    console.error("토큰 전송 실패:", error);
    transferError.value = "토큰 전송에 실패했습니다. 다시 시도해주세요.";
  } finally {
    isTransferring.value = false;
  }
};

// 전송 모달 열기
const openTransferModal = (tokenType) => {
  selectedTokenType.value = tokenType;
  transferError.value = "";
  recipientAddress.value = "";
  transferAmount.value = "";

  // Bootstrap 모달 열기
  try {
    const modalElement = document.getElementById("transferModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  } catch (error) {
    console.error("Bootstrap 모달 열기 실패:", error);
    // fallback: 직접 스타일로 모달 표시
    const modalElement = document.getElementById("transferModal");
    if (modalElement) {
      modalElement.classList.add("show", "d-block");
      modalElement.setAttribute("aria-hidden", "false");
      // backdrop 추가
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modalBackdrop";
      document.body.appendChild(backdrop);
    }
  }
};

// 현재 선택된 토큰의 잔액 반환
const getCurrentBalance = () => {
  switch (selectedTokenType.value) {
    case "ETH":
      return balance.value;
    case "KSH":
      return tokenBalance.value;
    case "LWH":
      return lwhTokenBalance.value;
    default:
      return "0";
  }
};

// 모달 backdrop 클릭 핸들러
const handleModalBackdropClick = (event) => {
  if (event.target.id === "transferModal") {
    closeTransferModal();
  }
};

// 전송 모달 닫기
const closeTransferModal = () => {
  // Bootstrap 모달 닫기
  try {
    const modalElement = document.getElementById("transferModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        // fallback: 직접 스타일로 모달 숨기기
        modalElement.classList.remove("show", "d-block");
        modalElement.setAttribute("aria-hidden", "true");
        // backdrop 제거
        const backdrop = document.getElementById("modalBackdrop");
        if (backdrop) {
          backdrop.remove();
        }
      }
    }
  } catch (error) {
    console.error("Bootstrap 모달 닫기 실패:", error);
    // fallback: 직접 스타일로 모달 숨기기
    const modalElement = document.getElementById("transferModal");
    if (modalElement) {
      modalElement.classList.remove("show", "d-block");
      modalElement.setAttribute("aria-hidden", "true");
    }
    // backdrop 제거
    const backdrop = document.getElementById("modalBackdrop");
    if (backdrop) {
      backdrop.remove();
    }
  }

  transferError.value = "";
  recipientAddress.value = "";
  transferAmount.value = "";
};

// 클립보드에 복사하는 함수
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("주소가 클립보드에 복사되었습니다!");
  } catch (err) {
    console.error("클립보드 복사 실패:", err);
    alert("클립보드 복사에 실패했습니다.");
  }
};

// 데이터 새로고침 함수
const refreshData = async () => {
  await getBalance();
  await getTotalSupply();
};

// 컴포넌트 마운트 시 이벤트 리스너 설정
onMounted(async () => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
  }

  // App.vue에서 보낸 이벤트 리스너
  eventBus.on("connectWallet", connectWallet);
  eventBus.on("disconnectWallet", disconnectWallet);
  eventBus.on("openTransferModal", openTransferModal);

  // 저장된 지갑 상태 복원
  if (walletState.value.isConnected && walletState.value.account) {
    console.log("저장된 지갑 상태 복원:", walletState.value);

    // 로컬 상태 복원
    account.value = walletState.value.account;
    isConnected.value = walletState.value.isConnected;
    balance.value = walletState.value.balance;
    tokenBalance.value = walletState.value.tokenBalance;
    totalSupply.value = walletState.value.totalSupply;

    // 전역 Provider와 Contract 재설정
    try {
      const providerSetup = await setupGlobalProvider(account.value);
      if (!providerSetup) {
        throw new Error("Provider 설정 실패");
      }

      // 잔액 새로고침
      await getBalance();
      await getTotalSupply();

      console.log("지갑 상태 복원 완료");
    } catch (error) {
      console.error("지갑 상태 복원 실패:", error);
      // 복원 실패 시 연결 해제
      disconnectWallet();
    }
  }
});

// 전역 함수로 노출 (App.vue에서 사용)
defineExpose({
  connectWallet,
  disconnectWallet,
  account,
  isConnected,
  balance,
  tokenBalance,
  totalSupply,
  openTransferModal,
});
</script>
