---
date: '1'
title: 'anvil-sim'
cover: './anvil-sim.png'
github: 'https://github.com/Siddardar/anvil-sim'
external: 'https://github.com/Siddardar/anvil-sim'
tech:
  - Rust
  - OCaml
  - Multithreading
  - Docker
---

A multithreaded, event-driven simulator in Rust for [AnvilHDL](https://arxiv.org/html/2503.19447v2), a timing-safe hardware description language. Instead of compiling designs to SystemVerilog and running them in Verilator, anvil-sim runs the compiler's event graphs directly, exported as JSON IR through an OCaml FFI layer I added to the compiler.

Each process runs on its own OS thread with a min-heap event scheduler, and processes talk over Mutex/Condvar channels. Lamport timestamps keep cycle counts deterministic across threads, versioned registers match RTL write timing, and non-blocking event parking prevents deadlock. A Dockerised harness checks its output against Verilator. Built as a research assistant at NUS's KISP Lab.
