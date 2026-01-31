const express = require('express');
const router = express.Router();
const controller = require('../controllers/performance');

/**
 * @swagger
 * tags:
 *   name: Performances
 *   description: 공연 정보 관리 API
 */

/**
 * @swagger
 * /api/performances:
 *   get:
 *     summary: 공연 목록 조회 (검색/필터/페이징/정렬)
 *     tags: [Performances]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호 
 * 
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 아이템 개수
 * 
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (공연명, 시설명)
 * 
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: "장르 필터 다중 선택시 ',' 로 구별. ex) 무용(서양/한국무용),대중무용 // * list - 연극, 서양음악(클래식), 뮤지컬, 한국음악(국악), 대중음악, 무용(서양/한국무용), 대중무용, 서커스/마술, 복합"
 * 
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [공연중, 공연예정, 공연완료]
 *         description: 공연 상태 필터, - 사용 시 전체 조회
 * 
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *           enum: [서울, 경기, 인천, 부산, 대구, 광주, 대전, 울산, 세종, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주]
 *         description: 지역 필터
 * 
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, views, likes, rating, end]
 *         description: 정렬 기준
 * 
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/performances/ranking:
 *   get:
 *     summary: 추천 랭킹 조회 (TOP 10)
 *     tags: [Performances]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: "장르 필터 다중 선택시 ',' 로 구별. ex) 무용(서양/한국무용),대중무용 // * list - 연극, 서양음악(클래식), 뮤지컬, 한국음악(국악), 대중음악, 무용(서양/한국무용), 대중무용, 서커스/마술, 복합"
 * 
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/ranking', controller.getRanking);

/**
 * @swagger
 * /api/performances/{id}:
 *   get:
 *     summary: 공연 상세 조회
 *     tags: [Performances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 공연 ID (mt20id)
 * 
 *     responses:
 *       200:
 *         description: 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: 공연 상세 정보
 */
router.get('/:id', controller.getDetail);

module.exports = router;