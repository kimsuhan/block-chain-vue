<template>
  <div class="container-fluid p-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg border-0">
          <div class="card-header bg-success text-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-arrow-left-right me-2"></i>
              DEX (Decentralized Exchange)
            </h5>
          </div>
          <div class="card-body">
            <div class="text-center py-5">
              <i class="bi bi-arrow-left-right display-1 text-success mb-3"></i>
              <h6 class="text-dark">DEX 기능</h6>
              <p class="text-muted">토큰 거래 기능이 준비 중입니다.</p>

              <!-- 지갑 연결 상태 표시 -->
              <div v-if="isConnected" class="alert alert-info mt-3">
                <i class="bi bi-wallet2 me-2"></i>
                연결된 지갑: {{ account.substring(0, 6) }}...{{
                  account.substring(38)
                }}
                <br />
                <small class="text-muted">
                  잔액: {{ balance }} ETH | 토큰: {{ tokenBalance }} KSH
                </small>
              </div>
              <div v-else class="alert alert-warning mt-3">
                <i class="bi bi-exclamation-triangle me-2"></i>
                DEX 기능을 사용하려면 지갑을 연결해주세요.
              </div>

              <div class="mt-4">
                <button class="btn btn-success btn-lg" disabled>
                  <i class="bi bi-clock me-2"></i>
                  개발 중...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  dexContract,
  eventBus,
  globalProvider,
  globalSigner,
  walletState,
} from "../utils/eventBus";

// 지갑 상태
const account = ref(walletState.value.account);
const isConnected = ref(walletState.value.isConnected);
const balance = ref(walletState.value.balance);
const tokenBalance = ref(walletState.value.tokenBalance);

// 지갑 상태 변경 이벤트 리스너
const handleWalletStateChange = (newState) => {
  account.value = newState.account;
  isConnected.value = newState.isConnected;
  balance.value = newState.balance;
  tokenBalance.value = newState.tokenBalance;
};

// DEX 기능 테스트 함수
const testDexConnection = () => {
  console.log("DEX 페이지 - 전역 Provider:", globalProvider.value);
  console.log("DEX 페이지 - 전역 Signer:", globalSigner.value);
  console.log("DEX 페이지 - DEX Contract:", dexContract.value);

  if (globalSigner.value) {
    console.log("DEX 페이지 - Signer 주소:", globalSigner.value.address);
  }
};

onMounted(() => {
  eventBus.on("walletStateChanged", handleWalletStateChange);

  // DEX 페이지 로드 시 전역 상태 확인
  setTimeout(() => {
    testDexConnection();
  }, 1000);
});
</script>
